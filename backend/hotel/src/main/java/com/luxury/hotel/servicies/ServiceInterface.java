package com.luxury.hotel.servicies;

import java.util.List;

public interface ServiceInterface<T, k> {
    T save(T t);
    List<T> findAll();
    T findById(k id);
    void deleteById(k id);
    T update(k id, T t);
}
